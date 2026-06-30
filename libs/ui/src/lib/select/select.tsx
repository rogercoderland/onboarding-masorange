import { Select as BaseSelect } from '@base-ui/react/select';
import { clsx } from 'clsx';
import { selectClasses } from './select.classes';
import type { SelectProps } from './select.types';
import './select.css';

export function Select<Value extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option…',
  label,
  name,
  disabled = false,
  className,
}: SelectProps<Value>) {
  // Maps each value to its label so the trigger shows the label according to base ui docs.
  const items = Object.fromEntries(
    options.map((option) => [option.value, option.label]),
  );

  return (
    <BaseSelect.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as Value)}
      name={name}
      disabled={disabled}
    >
      <span className={selectClasses.root}>
        {label && (
          <BaseSelect.Label className={selectClasses.label}>
            {label}
          </BaseSelect.Label>
        )}

        <BaseSelect.Trigger className={clsx(selectClasses.trigger, className)}>
          <BaseSelect.Value
            className={selectClasses.value}
            placeholder={placeholder}
          />
          <BaseSelect.Icon className={selectClasses.icon} aria-hidden="true">
            ▾
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
      </span>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6}>
          <BaseSelect.Popup className={selectClasses.popup}>
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={selectClasses.item}
              >
                <BaseSelect.ItemText className={selectClasses.itemText}>
                  {option.label}
                </BaseSelect.ItemText>
                <BaseSelect.ItemIndicator
                  className={selectClasses.itemIndicator}
                >
                  ✓
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
Select.displayName = 'Select';
