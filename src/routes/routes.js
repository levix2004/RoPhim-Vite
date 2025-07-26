import DetailFilm from "../pages/DetailFilm/DetailFilm";
import Home from "../pages/Home/Home";
export const routes = [
    { path: '/', component: Home },
    {path: '/xem-phim/:slug', component: DetailFilm},
];
