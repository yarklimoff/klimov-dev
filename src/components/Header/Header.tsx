import './Header.css';
import avatar from '../../images/photo.jpg';
export default function Header() {
  return (
    <header className="header">
      <div className="header__wrapper">
        <h1 className="header__title">
          <strong>
            Hi, my name is <em>Yaroslav</em>
          </strong>
          <br></br>a frontend developer
        </h1>
        <a href="https://disk.yandex.ru/i/NPPRFWKgsBqtiw" className="btn">
          Download CV
        </a>
      </div>
      <img className="avatar" src={avatar} alt="avatar"></img>
    </header>
  );
}
