import './Heading.css'

function Heading(props: {
  appName: string
  logoPath: string
}) {
  const { appName, logoPath } = props;

  return (
    <a className="heading-root" href="https://www.npmjs.com/package/@tws-js/server" target="_blank">
      <img src={logoPath} alt="Logo" className="logo" />
      <span>{appName}</span>
    </a>
  )
}

export default Heading
