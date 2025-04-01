import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { ToastAlert } from '../../utils/sweetAlert';
import logoAdmin from '../../assets/img/admin/logoAdmin.svg';
import useScreenSize from '../../hooks/useScreenSize';

const { VITE_BASE_URL: BASE_URL } = import.meta.env;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false); //局部loading

  //RWD:自訂hook
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 1440; // 螢幕寬 < 1440，返回true，否則返回false

  // 執行登入
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `apiToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      ToastAlert.fire({
        icon: 'success',
        title: res.data.message,
        text: `登入成功！`,
      });
      navigate('/admin/product');
    } catch (error) {
      ToastAlert.fire({
        icon: 'error',
        title: '登入失敗',
        text: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid loginPage">
      {isMobile && (
        <div className="tipBox">
          <span className="material-icons-outlined align-content-center me-2 fs-4">info </span>
          建議使用裝置解析度寬1440px以上
        </div>
      )}
      <div className="row">
        <div className="col-md-6">
          <div className="AdminLogo">
            <img src={logoAdmin} alt="logo" />
          </div>
        </div>
        <div className="col-md-6 login">
          <h1 className="h2 mt-0 text-white">後台管理系統</h1>
          <p className="text-white">創造專為毛孩打造的智能生活</p>
          <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
              <input
                className={`form-control ${errors.username && 'is-invalid'} `}
                id="username"
                type="email"
                placeholder="name@example.com"
                {...register('username', {
                  required: '請填寫Email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email格式錯誤',
                  },
                })}
              />
              <label htmlFor="username">Email address</label>
              {errors.username && (
                <p className="textBody3 text-white mb-2 mx-2 bg-danger py-1 px-2 bg-opacity-75">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                className={`form-control ${errors.password && 'is-invalid'} `}
                id="password"
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: '請填寫密碼',
                  minLength: {
                    value: 6,
                    message: '密碼至少6碼',
                  },
                })}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <p className="textBody3 text-white mb-2 mx-2 bg-danger py-1 px-2 bg-opacity-75">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-lg btn-primary w-100 d-flex justify-content-center gap-2"
              disabled={isLoading}
            >
              登入
              {isLoading && (
                <ReactLoading type={'spin'} color={'#000'} height={'1.2rem'} width={'1.2rem'} />
              )}
            </button>
          </form>
          <Link to="/" className="textBody3 text-white mt-3 text-underline">
            返回Smart Paw Life
          </Link>
          <p className="copyright textBody3">
            無商業用途且僅供作品展示
            <br />© Copyright 2025 SmartPaw Life. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
