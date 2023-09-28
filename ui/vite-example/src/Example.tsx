import { Checkbox, Chip, ColorInput, ColorPicker } from "@mantine/core";

export const Example = () => {
  return (
    <>
      <Checkbox defaultChecked label="I agree to sell my privacy" />
      <Chip defaultChecked variant="outline">
        Awesome chip
      </Chip>
      <ColorInput variant="filled" radius="xs" label="Input label" description="Input description" placeholder="Input placeholder" />
      <ColorPicker onChange={e => console.log(typeof e)} />
    </>
  );
};
