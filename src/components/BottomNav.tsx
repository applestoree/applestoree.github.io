import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>{' '}
      <NavLink to="/product">Product</NavLink>{' '}
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  )
}

export default BottomNav
