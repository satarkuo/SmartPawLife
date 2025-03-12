import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoHeader from '../../assets/img/front/LogoHeader.svg';

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, 3000);
    }, [])

    return (
        <div className="d-flex flex-column justify-content-center text-center p-5 gap-3" 
            style={{
                backgroundColor: '#F7EEE9', 
                height: '100vh'
            }}>
            <Link to='/' className="mb-5">
                <img src={logoHeader} alt="logo"/>
            </Link>
            <p  className="h1">Oops!</p>
            <h1 className="h1">找不到頁面</h1>
            <div><Link to='/' className="d-inline btn btn-lg btn-primary">立即返回首頁</Link></div>
            <p className="text-secondary">3秒後自動返回首頁</p>
        </div>
        
    )
}
export default NotFound;