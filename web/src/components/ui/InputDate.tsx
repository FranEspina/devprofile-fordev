"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, isValid, parse } from 'date-fns';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type SelectSingleEventHandler } from 'react-day-picker'
import { es } from 'date-fns/locale';

export interface InputDateProps {
  date: Date | undefined,
  onSelect: (date: Date | undefined) => void | undefined
  autoClosed?: boolean,
  id?: string,
}


export function InputDate({ id, date, onSelect, autoClosed = true }: InputDateProps) {

  const [selected, setSelected] = React.useState<Date>();
  const [inputValue, setInputValue] = React.useState<string>('');
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  React.useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, 'dd/MM/y'));
    }
  }, [])

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const date = parse(e.currentTarget.value, 'dd/MM/y', new Date());
    setInputValue(e.currentTarget.value);
  };

  const handleInputBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const date = parse(e.currentTarget.value, 'dd/MM/y', new Date());
    if (isValid(date)) {
      setInputValue(e.currentTarget.value);
      setSelected(date);
      if (onSelect) {
        onSelect(date)
      }
    } else {
      setSelected(undefined);
      if (onSelect) {
        onSelect(undefined)
      }
    }
  };

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };


  const handleDaySelect: SelectSingleEventHandler = (date) => {
    setSelected(date);
    if (date) {
      setInputValue(format(date, 'dd/MM/y'));
      if (onSelect) {
        onSelect(date)
      }
      if (autoClosed) {
        closePopper();
      }
    } else {
      setInputValue('');
      onSelect(undefined)
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  return (
    <div className="flex flex-row gap-1 items-center">
      <Input id={id}
        className="w-30 text-xs md:text-sm"
        type="text"
        // placeholder={format(new Date(), 'dd/MM/y')}
        placeholder="dd/mm/yyyy"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        maxLength={10}
      />
      <Popover open={isPopperOpen} onOpenChange={setIsPopperOpen} defaultOpen={isPopperOpen}>
        <PopoverTrigger asChild>

          <Button
            variant={"outline"}
            ref={buttonRef}
            onClick={handleButtonClick}
            className={cn(
              "w-[240px] justify-start text-left font-normal text-xs md:text-sm",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar weekStartsOn={1} locale={es}
            className="text-xs md:text-sm"
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}