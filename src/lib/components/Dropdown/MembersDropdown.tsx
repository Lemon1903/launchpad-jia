"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/Avatar/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/lib/components/ui/Command/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/components/ui/Popover/popover";
import "@/lib/styles/dropdowns/members-dropdown.scss";

const sampleUsers = [
  {
    id: "user-1",
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=1",
    email: "alice@example.com",
  },
  {
    id: "user-2",
    name: "Bob Smith",
    image: "https://i.pravatar.cc/150?img=2",
    email: "bob@example.com",
  },
  {
    id: "user-3",
    name: "Charlie Brown",
    image: "https://i.pravatar.cc/150?img=3",
    email: "charlie@example.com",
  },
  {
    id: "user-4",
    name: "Diana Prince",
    image: "https://i.pravatar.cc/150?img=4",
    email: "diana@example.com",
  },
  {
    id: "user-5",
    name: "Ethan Hunt",
    image: "https://i.pravatar.cc/150?img=5",
    email: "ethan@example.com",
  },
  {
    id: "user-6",
    name: "Fiona Gallagher",
    image: "https://i.pravatar.cc/150?img=6",
    email: "fiona@example.com",
  },
];

export default function MembersDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleSelectMember(memberId: string) {
    console.log("Selected member ID:", memberId);
    setValue(memberId);
    setOpen(false);
  }

  return (
    <div className="members-dropdown">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="dropdown-btn fade-in-bottom members-dropdown__trigger">
            <span className="members-dropdown__trigger-content">
              <i className="la la-user members-dropdown__trigger-icon" /> Add member
            </span>
            <i
              className={`la members-dropdown__trigger-caret ${open ? "la-angle-up" : "la-angle-down"}`}
            ></i>
          </button>
        </PopoverTrigger>
        <PopoverContent className="members-dropdown__popover-content" align="end">
          <Command>
            <CommandInput placeholder="Search member" />
            <CommandList>
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                {sampleUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    keywords={[user.name, user.email]}
                    onSelect={(currentValue) => handleSelectMember(currentValue)}
                    className="members-dropdown__item"
                  >
                    <Avatar className="members-dropdown__item-avatar">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="members-dropdown__item-text">
                      <span className="members-dropdown__item-name">{user.name}</span>
                      <span className="members-dropdown__item-email">{user.email}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
