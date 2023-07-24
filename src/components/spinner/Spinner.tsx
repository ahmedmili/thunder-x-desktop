import Style from "./spinner.module.scss";
type SpinnerProps = {
  name: string;
  borderColor?: string;
  borderLeftColor?: string;
};
const Spinner = ({
  name,
  borderColor = "#CCC",
  borderLeftColor = "#FFF",
}: SpinnerProps) => {
  const style = { borderColor: borderColor, borderLeftColor: borderLeftColor };
  return (
    <div className={Style.spinner}>
      <p> {name} </p>
      <div style={style}></div>
    </div>
  );
};
export default Spinner;
