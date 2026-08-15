import './Navbar.css'
import { FaGithub } from 'react-icons/fa'
import {FaInstagram} from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo"><span></span>Made by <a href="https://github.com/ariocodes">Ario Bashiri</a></div>
      <div className="nav-links">
        <div className="link"><a href="https://github.com/ariocodes" target="_blank" rel="noreferrer" className="link"><FaGithub/></a></div>
        <div className="link"><a href="https://www.instagram.com/ariobashiri" target="_blank" rel="noreferrer" className="link"><FaInstagram/></a></div>
        <div className="link"><a href="https://www.linkedin.com/in/ario-bashiri/" target="_blank" rel="noreferrer" className="link"><FaLinkedin/></a></div>
      </div>
    </nav>
  )
}

export default Navbar
