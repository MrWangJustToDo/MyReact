import { Checkbox, Chip, ColorInput, ColorPicker, Space, Fieldset, TextInput, FileInput, JsonInput, SegmentedControl, Slider, Burger, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const Example = () => {

  const [opened, { toggle }] = useDisclosure();

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
      <ColorPicker onChange={(e) => console.warn(e)} />
      <Space h="md" />
      <Fieldset legend="Personal information" variant="filled">
        <TextInput label="Your name" placeholder="Your name" />
        <TextInput label="Email" placeholder="Email" mt="md" />
      </Fieldset>
      <Space h="md" />
      <FileInput label="Input label" variant="filled" description="Input description" />
      <Space h="md" />
      <JsonInput
        label="Your package.json"
        placeholder="Textarea will autosize to fit the content"
        validationError="Invalid JSON"
        formatOnBlur
        autosize
        minRows={4}
      />
      <Space h="md" />
      <SegmentedControl data={["React", "Angular", "Vue"]} />
      <Space h="md" />
      <Slider
        color="blue"
        marks={[
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
      />
      <Space h="lg" />
      <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" ml={2} />
      <Space h="md" />
      <Pagination total={20} />
    </>
  );
};
