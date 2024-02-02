// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'network',
    path: '/network',
    icon: icon('ic_network'),
  },
  {
    title: 'transaction',
    path: '/transaction',
    icon: icon('ic_transaction'),
  },
];


export default navConfig;
