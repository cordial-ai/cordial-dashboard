"use client"

import * as React from "react"
import { Check, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Option = {
  value: string
  label: string
}

type GroupedOption = {
  label: string
  options: Option[]
}

type MultiSelectProps = {
  options: (Option | GroupedOption)[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (item: Option) => {
    setInputValue("")
    if (selected.includes(item.value)) {
      handleUnselect(item.value)
    } else {
      onChange([...selected, item.value])
    }
  }

  const isGrouped = (option: Option | GroupedOption): option is GroupedOption => {
    return "options" in option
  }

  const allOptions = options.flatMap((group) => (isGrouped(group) ? group.options : [group]))

  const selectedItems = selected.map((value) => allOptions.find((option) => option.value === value)!)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedItems.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedItems.map((item) => (
                <Badge variant="secondary" key={item.value} className="mr-1">
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item.value)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(item.value)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            {options.map((group, index) => (
              <CommandGroup key={index} heading={isGrouped(group) ? group.label : ""}>
                {(isGrouped(group) ? group.options : [group]).map((option: Option) => (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option)} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      {option.label}
                      {selected.includes(option.value) && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

