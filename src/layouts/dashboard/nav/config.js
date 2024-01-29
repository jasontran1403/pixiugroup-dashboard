// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const r = localStorage.getItem("r");

const navConfig = [];
const adminNav = r === "a";
const managerNav = r === "m";
const userNav = r === "u";

// if (adminNav) {
//   navConfig.push({
//     title: 'dashboard',
//     path: '/dashboard',
//     icon: icon('ic_analytics'),
//   });
//   navConfig.push({
//     title: 'network',
//     path: '/network',
//     icon: icon('ic_network'),
//   });
//   navConfig.push({
//     title: 'transaction',
//     path: '/transaction',
//     icon: icon('ic_transaction'),
//   });
//   navConfig.push({
//     title: 'commission',
//     path: '/commission',
//     icon: icon('ic_transaction'),
//   });
// }
// else if (managerNav) {
//   navConfig.push({
//     title: 'dashboard',
//     path: '/dashboard',
//     icon: icon('ic_analytics'),
//   });
//   navConfig.push({
//     title: 'network',
//     path: '/network',
//     icon: icon('ic_network'),
//   });
//   navConfig.push({
//     title: 'transaction',
//     path: '/transaction',
//     icon: icon('ic_transaction'),
//   });
// } else if (userNav) {
//   navConfig.push({
//     title: 'dashboard',
//     path: '/dashboard',
//     icon: icon('ic_analytics'),
//   });
//   navConfig.push({
//     title: 'network',
//     path: '/network',
//     icon: icon('ic_network'),
//   });
//   navConfig.push({
//     title: 'transaction',
//     path: '/transaction',
//     icon: icon('ic_transaction'),
//   });
// }

navConfig.push({
  title: 'dashboard',
  path: '/dashboard',
  icon: icon('ic_analytics'),
});
navConfig.push({
  title: 'network',
  path: '/network',
  icon: icon('ic_network'),
});
navConfig.push({
  title: 'transaction',
  path: '/transaction',
  icon: icon('ic_transaction'),
});
navConfig.push({
  title: 'commission',
  path: '/commission',
  icon: icon('ic_transaction'),
});

export default navConfig;
