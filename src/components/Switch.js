import Classes from "../styles/Switch.module.css";
const Switch = () => {
  const themeChange = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  };
  return (
    <label id="switch" className={Classes.switch}>
      <input type="checkbox" id="slider" onChange={(e) => themeChange(e)} />
      <span className={`${Classes.slider} ${Classes.round}`}></span>
    </label>
  );
};

export default Switch;
