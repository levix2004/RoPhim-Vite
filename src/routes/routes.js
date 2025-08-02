import MovieWatch from '../pages/MovieWatch/MovieWatch';
import Home from '../pages/Home/Home';
import Movie from '../pages/Movie/Movie';
export const routes = [
    { path: '/', component: Home },
    { path: '/xem-phim/:slug', component: MovieWatch },
    { path: '/phim/:slug', component: Movie },
];
