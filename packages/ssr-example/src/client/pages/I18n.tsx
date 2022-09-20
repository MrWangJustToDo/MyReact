import { Box, Button, Code } from "@chakra-ui/react";
import { useIntl } from "react-intl";

import { useLang } from "@client/hooks";
import { supportedLang } from "@shared";

export default function Index() {
  const { formatMessage: f } = useIntl();
  const { lang, changeLang } = useLang();

  return (
    <>
      <Box>
        <p>current lang: {lang}</p>
        {Object.keys(supportedLang).map((key) => (
          <Button key={key} onClick={() => changeLang(key)}>
            change to {key}
          </Button>
        ))}
        <br />
        <Code>{f({ id: "app.title", defaultMessage: "hello" })}</Code>
        <br />
        <Code>{f({ id: "home.lead", defaultMessage: "test" })}</Code>
        <br />
        <Code>{f({ id: "home.title", defaultMessage: "title" })}</Code>
        <br />
      </Box>
    </>
  );
}

export const isStatic = true;
