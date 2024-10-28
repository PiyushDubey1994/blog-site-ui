import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import { useEffect } from 'react';

function useMaterialize() {
    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        // eslint-disable-next-line no-undef
        M.Sidenav.init(elems);
    }, []);
}

export default useMaterialize;
