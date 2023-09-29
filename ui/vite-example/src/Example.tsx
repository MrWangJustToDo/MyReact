import { Checkbox, Chip, ColorInput, ColorPicker, Space } from "@mantine/core";

export const Example = () => {
  return (
    <>
      <Checkbox defaultChecked label="I agree to sell my privacy" />
      <Space h="md" />
      <Chip defaultChecked variant="outline">
        Awesome chip
      </Chip>
      <Space h="md" />
      <ColorInput variant="filled" radius="xs" label="Input label" description="Input description" placeholder="Input placeholder" />
      <Space h="md" />
      <ColorPicker onChange={(e) => console.log(typeof e)} />
    </>
  );
};
