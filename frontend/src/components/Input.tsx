"use client";
export default function TextInput({
  name = "",
  label = "",
  onChange = (e :React.ChangeEvent<HTMLInputElement>) => {},
  value = "",
  capitalize = false,
  maxLength = Infinity,
}) {
  return (
    <div className="w-fit flex flex-col items-start gap-0.5">
      <label>{label}</label>
      <input
        name={name}
        className="bg-gray-500 rounded-md p-2"
        onChange={(e :React.ChangeEvent<HTMLInputElement>) => {
          if (capitalize) {
            e.target.value = e.target.value.toUpperCase();
          }
          onChange(e);
        }}
        value={value}
        maxLength={maxLength}
      />
    </div>
  );
}
