main.jsx
- import 'bootstrap/dist/css/bootstrap.min.css'       
- import 'bootstrap/dist/js/bootstrap.bundle.min.js'

Header.jsx
- Removed import "react" as not needed
- changed styling using bootstrap 

Footer.jsx
- Removed some divs
- Still using .css for logo size

Home.jsx
- Landing page
- useNavigate to /character-select
- May need to implement cookies 

CharacterSelection.jsx
- Carousel bootstrap doesnt work
- https://github.com/EdgardooTorress/eCommerce2/blob/main/src/components/ProductSlider.jsx (using edgardo slider handler)
- "Welcome, *username*" on line 59 (and the other wordings) need styling and color

Simulator.jsx


Leaderboard.jsx

Colors
- Buttons: background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
- Title: White
- Subtitle: 
- Links: #60a5fa
- 

BOOTSTRAP
- Version 5.3
- npm install bootstrap react-bootstrap (already done)
- Documentation = https://getbootstrap.com/docs/5.3/getting-started/introduction/
useState Hook
- Documentation = https://react.dev/reference/react/useState