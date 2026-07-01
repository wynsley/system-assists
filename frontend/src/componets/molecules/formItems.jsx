import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Select } from "../atoms/select";
import { Textarea } from "../atoms/textarea";

function FormItem({
  formFields,
  inputVariant = 'default',
  inputAlign = 'left',
  inputSize = 'small',
  selectVariant = 'default',
  selectSize = 'small',
  labelSize = 'small',
  required = false
}) {
  return (
    <div className="flex flex-col gap-4 w-full">

      {formFields.map((item, i) => {

        // GRUPOS (como celular/personas, fecha/hora...)
        if (Array.isArray(item)) {
          return (
            <div
              key={i}
              className="
                grid 
                grid-cols-1 
                md:grid-cols-2 
                gap-10
                w-full
              "
            >
              {item.map((field, j) => (
                <div key={j} className="flex flex-col gap-2 w-full">

                  <Label
                    text={field.text}
                    htmlFor={field.htmlFor}
                    size={labelSize}
                  />

                  {field.type === 'select' ? (
                    <Select
                      name={field.name}
                      value={field.value}
                      options={field.options}
                      onChange={field.onChange}
                      variant={selectVariant}
                      size={selectSize}
                      required={required}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      name={field.name}
                      value={field.value}
                      placeholder={field.placeholder}
                      onChange={field.onChange}
                      variant={inputVariant}
                      align={inputAlign}
                      size={inputSize}
                      icon={field.icon}
                      required={required}
                      onIconClick={field.onIconClick}
                    />
                  )}

                </div>
              ))}
            </div>
          );
        }

        // CAMPO INDIVIDUAL
        return (
          <div key={i} className="flex flex-col gap-2 w-full">

            <Label
              text={item.text}
              htmlFor={item.htmlFor}
              size={labelSize}
            />

            {item.type === "select" ? (
              <Select
                name={item.name}
                value={item.value}
                options={item.options}
                onChange={item.onChange}
                variant={selectVariant}
                size={selectSize}
                required={required}
              />
            ) : item.type === "textarea" ? (
              <Textarea
                name={item.name}
                value={item.value}
                placeholder={item.placeholder}
                onChange={item.onChange}
                rows={item.rows}
              />
            ) : (
              <Input
                type={item.type}
                name={item.name}
                value={item.value}
                placeholder={item.placeholder}
                onChange={item.onChange}
                align={inputAlign}
                size={inputSize}
                variant={inputVariant}
                icon={item.icon}
                onIconClick={item.onIconClick}
                required={required}
              />
            )}
          </div>
        );
      })}

    </div>
  );
}

export { FormItem }