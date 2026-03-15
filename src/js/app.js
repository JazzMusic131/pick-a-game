// Required for dev hot reload
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR")
  });
}


/* STYLES */
import '../css/app.css';
import 'virtual:svg-icons-register';

/* Alpine */
import './alpine/index';


/* MODULES */

import { initPreloads } from './modules/misc';
initPreloads();

/* END - MODULES */


/* Say hi */
console.log("👋️");