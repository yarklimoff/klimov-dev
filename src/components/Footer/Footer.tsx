import './Footer.css';
import vk from '../../images/icons/vk.svg';
import github from '../../images/icons/gitHub.svg';
import telegram from '../../images/icons/telegram.svg';

export default function Footer() {
  return (
    <footer className={'footer'}>
      <div className={'container'}>
        <div className={'footer__wrapper'}>
          <ul className={'social'}>
            <li className={'social__item'}>
              <a href="https://vk.com/klimov_yaroslav">
                <img src={vk} alt="Link"></img>
              </a>
            </li>
            <li className={'social__item'}>
              <a href="https://t.me/klimov_yaroslav">
                <img src={telegram} alt="Link"></img>
              </a>
            </li>
            <li className={'social__item'}>
              <a href="https://github.com/yarklimoff">
                <img src={github} alt="Link"></img>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
