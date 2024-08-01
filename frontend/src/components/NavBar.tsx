import '../css/Header.scss'

export default function NavBar() {
  return (
    <div className='header'>
        <div className="header-button home-button"> <p> Home </p></div>
        <div className="header-button login-button"> <p> Login </p></div>
    </div>
  );
}