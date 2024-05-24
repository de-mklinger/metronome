import Container from "./controls/Container.tsx";
import Button from "./controls/Button.tsx";

export default function ErrorScreen() {
  return (
    <Container>
      <h1>Error</h1>
      <p>
        An error occured.
      </p>
      <Button variant="secondary" onClick={() => location.reload()}>
        Reload page
      </Button>
    </Container>
  )
}
