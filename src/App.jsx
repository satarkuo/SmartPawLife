import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Provider } from 'react-redux'
import store from './redux/store';
import Toast from "./component/Toast";

const App = () => {
    return(
        <Provider store={store}>
            <Toast />
            <RouterProvider router={router} />
                
        </Provider>
    )
}

export default App;