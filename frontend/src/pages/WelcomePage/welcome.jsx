import { useNavigate } from 'react-router-dom';
import './welcome.css';
import logoImg from '../../images/Logo.png';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="split-layout">
        {/*Nửa Trái: Giao diện UI trắng sáng*/}
        <div className="left-panel">
            
            <header className="header">
                <div className="logo-container">
                    <img src={logoImg} alt="logo" className="logo-img"/>
                    <div className="logo-text">
                        <h1>QFix</h1>
                        <p>QSVN</p>
                    </div>
                </div>
                
                <div className="auth-buttons">
                    <button className="btn-login" onClick={() => navigate('/select-role')}>Đăng nhập</button>
                    <button className="btn-register" onClick={() => navigate('/select-role')}>Đăng ký</button>
                </div>
            </header>

            <main className="content">
                <h2>Cổng Báo Cáo Sự Cố <span>Ký Túc Xá</span></h2>
                <p>Nhanh chóng, minh bạch và hiệu quả. Nơi tiếp nhận mọi phản ánh về cơ sở vật chất của sinh viên Trung tâm GDQP&AN.</p>
                
                <button className="btn-go-home" onClick={() => navigate('/select-role')}>
                    Đi đến trang chủ
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </main>

        </div>

        {/*Nửa Phải: Dành trọn vẹn cho tấm ảnh tòa nhà*/}
        <div className="right-panel"></div>
    </div>
  );
}

export default Welcome;