import '../sass/style.scss';

import autocomplete from './modules/autocomplete'
import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead'
import makeMap from './modules/map'

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));

makeMap($('#map'));
