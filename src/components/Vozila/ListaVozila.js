import React, { useEffect, useState, useCallback, useContext } from 'react';
import ElementListe from './ElementListe';
import HelperFuntion from '../../helper/HelperFunction';
import { LoaderCustom } from '../LoaderCustom';
import { TContext } from '../context';
import { FixedSizeList as List } from 'react-window';
import RSC from 'react-scrollbars-custom';

/* global wialon */

const listRef = React.createRef();
const outerRef = React.createRef();

// utills function
function msg(msg) {
  console.log(msg);
}

// Main app class
const ListaVozila = () => {
  const { svaVozilaC } = useContext(TContext);
  const [svaVozilaCValue, setSvaVozilaCValue] = svaVozilaC;
  const {
    GetInfoVozilo,
    ProveraObuke,
    KonverterVremenaIzBaze,
    checkNested,
    VratiSveInfoVozilo,
  } = HelperFuntion();

  const [svaVozila, setSvaVozila] = useState([]);
  const [pretraga, setPretraga] = useState('');
  const [duzeOd24, setDuzeOd24] = useState({ svi: true, duze: false });
  const [loading, setLoading] = useState(true);
  const [svaInfoVozila, setSvaInfoVozila] = useState([]);
  const [checkNikad, setCheckedNikad] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const data = await ProveraObuke();
      if (!data.length) return;
      let result = window.confirm(`Potsetnik za obuku\n
        ${data.map(
          m => 'firma ' + m.naziv + ' u ' + KonverterVremenaIzBaze(m.zakazana)
        )}
        `);
      if (!result) return null;
    }, [900000]);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const token = `${process.env.REACT_APP_TOKEN_ANALIZE}`;

  useEffect(() => {
    componentDidMount();
  }, []);

  const componentDidMount = () => {
    // initialize Wialon session
    wialon.core.Session.getInstance().initSession('https://hst-api.wialon.com');
    // Try to login when component mount
    wialon.core.Session.getInstance().loginToken(
      token,
      '', // try to login
      code => {
        // login callback
        // if error code - print error message
        if (code) {
          msg(wialon.core.Errors.getErrorText(code));
          return;
        }
        init();
      }
    );
  };
  const init = async () => {
    const sess = wialon.core.Session.getInstance(); // get instance of current Session
    // flags to specify what kind of data should be returned
    const flags =
      wialon.item.Item.dataFlag.base |
      wialon.item.Unit.dataFlag.sensors |
      wialon.item.Unit.dataFlag.lastMessage |
      wialon.item.Unit.dataFlag.counters |
      wialon.item.Unit.dataFlag.restricted |
      wialon.item.Unit.dataFlag.other;
    sess.loadLibrary('unitSensors'); // load Sensor Library

    sess.loadLibrary('itemIcon'); // load Icon Library
    sess.updateDataFlags(
      // load items to current session
      [{ type: 'type', data: 'avl_unit', flags: flags, mode: 0 }], // Items specification
      async code => {
        // updateDataFlags callback
        if (code) {
          msg(wialon.core.Errors.getErrorText(code));
          return;
        } // exit if error code

        // get loaded 'avl_unit's items
        const units = sess.getItems('avl_unit');
        if (!units || !units.length) {
          msg('Units not found');
          return;
        } // check if units found
        let unitsStateSvi = [];
        for (let i = 0; i < units.length; i++) {
          // setLoading(true)
          let unit = units[i];
          // let bazaInfo=await GetInfoVozilo(unit.getId())
          // if (unit.getLastMessage())
          unitsStateSvi.push({
            unit: {
              id: unit.getId(),
              name: unit.getName(),
              raw: unit,
            },
            //    bazaInfo:bazaInfo
          });
        }

        const res = unitsStateSvi.sort(function (a, b) {
          const date1 = checkNested(a.unit.raw, '$$user_lastMessage', 't')
            ? a.unit.raw.$$user_lastMessage.t
            : null;
          const date2 = checkNested(b.unit.raw, '$$user_lastMessage', 't')
            ? b.unit.raw.$$user_lastMessage.t
            : null;
          return date1 - date2;
        });

        setSvaVozila(res);
        setSvaVozilaCValue(res)
        setSvaInfoVozila(await VratiSveInfoVozilo());
        setLoading(false);
      }
    );
  };
  const filter = svaVozila.filter(m => {
    return m.unit.name.toLowerCase().includes(pretraga.toLowerCase());
  });
  const NikadSeNisuJaviliFilter = async e => {
    setCheckedNikad(prev => (prev = !prev));
    if (checkNikad) {
      const filter = svaVozila.filter(m => {
        return checkNested(m.unit.raw, '$$user_lastMessage', 't');
      });
      setSvaVozila(filter);
    } else {
      init();
    }
  };
  const ScrollTo24 = () => {
    let indexNiz = 0;
    const date = (new Date() / 1000) | 0;
    const razlika = 86400;
    for (let i = 0; i < svaVozila.length; i++) {
      if (!checkNested(svaVozila[i].unit.raw, '$$user_lastMessage', 't'))
        console.log('-');
      else if (date - svaVozila[i].unit.raw.$$user_lastMessage.t < razlika) {
        //console.log(svaInfoVozila[i]);
        indexNiz = i;
        break;
      }
    }
    listRef.current.scrollToItem(indexNiz);
  };

  const Row = useCallback(({ index, style }) => {
    const { unit } = filter[index] || {};
    return (
      <div style={style}>
        <ElementListe
          svaInfoVozila={svaInfoVozila}
          setSvaInfoVozila={setSvaInfoVozila}
          vozila={filter}
          setVozila={setSvaVozila}
          vozilo={unit}
          init={init}
        />
      </div>
    );
  });

  return (
    <div className='lista'>
      {loading && (
        <div
          style={{
            width: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoaderCustom />
        </div>
      )}
      {!loading && (
        <div style={{ width: '400px' }}>
          <input
            value={pretraga}
            type='text'
            onChange={e => setPretraga(prev => (prev = e.target.value))}
            name=''
            id=''
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <div>
              <input
                checked={checkNikad}
                type='checkbox'
                onChange={NikadSeNisuJaviliFilter}
                name='nikad'
              />
              <label htmlFor='nikad'>Nikad se nisu javili</label>
            </div>
            <div>
              <button onClick={ScrollTo24}>Scroll to 24h</button>
            </div>

            <svg
              style={{
                border: '1px solid grey',
                margin: '1px',
                background: 'lightGray',
                borderRadius: '2px',
              }}
              onClick={() => {
                setCheckedNikad(true);
                init();
              }}
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
            >
              <path d='M9 12l-4.463 4.969-4.537-4.969h3c0-4.97 4.03-9 9-9 2.395 0 4.565.942 6.179 2.468l-2.004 2.231c-1.081-1.05-2.553-1.699-4.175-1.699-3.309 0-6 2.691-6 6h3zm10.463-4.969l-4.463 4.969h3c0 3.309-2.691 6-6 6-1.623 0-3.094-.65-4.175-1.699l-2.004 2.231c1.613 1.526 3.784 2.468 6.179 2.468 4.97 0 9-4.03 9-9h3l-4.537-4.969z' />
            </svg>
          </div>
          <div>
            <List
              ref={listRef}
              height={window.innerHeight - 45}
              itemCount={filter.length}
              itemSize={80}
              width={400}
              outerElementType={CustomScrollbarsVirtualList}
              outerRef={outerRef}
              onScroll={({ scrollOffset, scrollUpdateWasRequested }) => {
                if (scrollUpdateWasRequested) {
                  console.log(
                    'TODO: check scroll position',
                    scrollOffset,
                    outerRef.current.scrollHeight
                  );
                }
              }}
            >
              {Row}
            </List>
          </div>
        </div>
      )}
    </div>
  );
};
const CustomScrollbars = ({
  children,
  forwardedRef,
  onScroll,
  style,
  className,
}) => {
  return (
    <RSC
      className={className}
      style={style}
      scrollerProps={{
        renderer: props => {
          const { elementRef, onScroll: rscOnScroll, ...restProps } = props;

          return (
            <span
              {...restProps}
              onScroll={e => {
                onScroll(e);
                rscOnScroll(e);
              }}
              ref={ref => {
                forwardedRef(ref);
                elementRef(ref);
              }}
            />
          );
        },
      }}
    >
      {children}
    </RSC>
  );
};

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
));

export default React.memo(ListaVozila);
