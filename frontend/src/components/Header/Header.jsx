import './Header.css';

export default function Header({ title = 'Bảng điều khiển' }) {
  return (
    <header className="topbar">
      <div className="page-title">{title}</div>

      <div className="user-profile">
        <div className="user-info">
          <div className="user-name">Nguyễn Văn A</div>
          <div className="user-room">Phòng: A202 | SV: 20231234</div>
        </div>
        <img src="https://ui-avatars.com/api/?name=Nguyen+Van+A&background=e2e8f0&color=334155" alt="Avatar" className="avatar" />
      </div>
    </header>
  );
}
