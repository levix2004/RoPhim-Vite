import MovieWatch from '../pages/MovieWatch/MovieWatch';
import Home from '../pages/Home/Home';
import Movie from '../pages/Movie/Movie';
import Category from '../pages/Category/Category';
import Country from '../pages/Country/Country';
import Topic from '../pages/Topic/Topic';
import Profile from '../pages/Profile/Profile';

export const routes = [
    { path: '/', component: Home },
    { path: '/xem-phim/:slug', component: MovieWatch },
    { path: '/phim/:slug', component: Movie },
    { path: '/the-loai/:slug', component: Category },
    
    { path: '/quoc-gia/:slug', component: Country },
    { path: '/chu-de/:slug', component: Topic },
    { path: '/Profile', component: Profile },
];
