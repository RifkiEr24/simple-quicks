import { Dialog, DialogContent } from "@/components/ui/Dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { getTodos } from "@/services/todo";
import { useEffect, useState } from "react";
import { Checkbox } from "./checkbox";
import clsx from "clsx";
import IconClock from "../icon/IconClock";
import IconCalendar from "../icon/IconCalendar";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./Button";
import IconPen from "../icon/IconPen";
import { Textarea } from "./textarea";
import { Input } from "./input";
import IconLoading from "../icon/IconLoading";

export default function QuickTask({ open, index, onClose, container }) {
  
  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const [addTodoData, setAddTodoData] = useState({
    title: "",
    description: "",
    dateDeadline: null,
    completed: false,
  });

  const [todosContainer, setTodosContainer] = useState(null);

  const getRandomDeadline = () => {
    const currentDate = new Date();
    const daysToAdd = Math.floor(Math.random() * 28); // Random number between 0 and 27 (inclusive)
    const randomDeadline = new Date(currentDate);
    randomDeadline.setDate(currentDate.getDate() + daysToAdd - Math.floor(Math.random() * 2) * daysToAdd * 2);
    return randomDeadline;
  };

  const handleGetTodo = async () => {
    try {
      setLoading(true);
      const response = await getTodos();

      if (response.status === 200) {
        const todos = response.data.map((todo) => ({ ...todo, dateDeadline: getRandomDeadline(), description: '', editDescription: false}));
        setTodos(todos)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSetDeadline = (todo,value) => {
    setTodos((prev) => {
      const newTodos = [...prev];
      const index = newTodos.findIndex((t) => t.id === todo.id);
      newTodos[index] = { ...todo, dateDeadline: value };
      return newTodos;
    });
  
  }


    const scrollTodosContainerToBottom = () => {
      if (todosContainer) {
        todosContainer.scrollTop = todosContainer.scrollHeight;
      }
    };

    const handleSetAddTrue = () => {
      setIsAddingTodo(true);
      scrollTodosContainerToBottom();
    };

  
  useEffect(() => {
    if (open) handleGetTodo();
  }, [open]);

  return (
    <Dialog open={open} modal={false}>
      <DialogContent index={index} onClose={onClose} container={container} className="py-[22px] px-[32px] overflow-y-hidden">
        {
          loading ?    <div className="flex flex-col gap-3 items-center justify-center text-center text-primary-3 h-full text-sm">
          <div className="w-20 h-20">
          <IconLoading />

          </div>
          <span>Loading Task...</span>
        </div> : <> 
        <div className="flex justify-end mb-4">
          <Button onClick={() => {
            handleSetAddTrue()
          }}>New Task</Button>
        </div>
        <div className=" text-sm font-normal overflow-y-auto h-full text-primary-2 scroll-smooth pb-8   scrollbar-w-[1px]" ref={setTodosContainer}>
     
          <Accordion type="multiple" collapsible className="w-full">
            {todos.length
              ? todos.map((todo) => (
                  <AccordionItem value={todo.id} key={todo.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 w-full pr-3">
                        <Checkbox checked={todo.completed} onCheckedChange={(value) => {
                          setTodos((prev) => {
                            const newTodos = [...prev];
                            const index = newTodos.findIndex((t) => t.id === todo.id);
                            newTodos[index] = { ...todo, completed: value};
                            return newTodos;
                          })
                        }} />
                        <span
                          className={clsx(
                            "font-semibold truncate max-w-[200px]",
                            todo.completed ? "line-through !text-primary-3" : "!text-primary-2"
                          )}
                        >
                          {todo.title}
                        </span>
                        <div className="flex ml-auto items-center gap-2">
                          <span className="text-xs text-indicator-3">
                          {todo.completed ? null : todo.dateDeadline ? (
                                todo.dateDeadline < new Date() ? (
                                  `${Math.abs(
                                    Math.floor((new Date() - todo.dateDeadline) / (1000 * 60 * 60 * 24))
                                  )} days overdue`
                                ) : (
                                  todo.dateDeadline.toDateString() === new Date().toDateString() ? (
                                    "Today"
                                  ) : (
                                    ` ${Math.abs(
                                      Math.floor((todo.dateDeadline - new Date()) / (1000 * 60 * 60 * 24))
                                    )} days left`
                                  )
                                )
                              ) : null}
                          </span>
                          <span className="text-xs">
                            {todo.dateDeadline ? format(todo.dateDeadline, "PPP") : "No Deadline"}
                          </span>
                        </div>
                       
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <IconClock />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={clsx(
                                  "w-[193px] justify-start flex gap-2 text-left font-normal",
                                  !todo.dateDeadline && "text-muted-foreground"
                                )}
                              >
                                {todo.dateDeadline ? (
                                  format(todo.dateDeadline, "PPP")
                                ) : (
                                  <span>Set Date</span>
                                )}
                                <div className="ml-auto">
                                <IconCalendar  />

                                </div>

                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={todo.dateDeadline}
                                onSelect={(value) => {handleSetDeadline(todo, value)}}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex items-center gap-5 cursor-pointer" >
                          <div  onClick={() => {
                          setTodos((prev) => {
                            const newTodos = [...prev];
                            const index = newTodos.findIndex((t) => t.id === todo.id);
                            newTodos[index] = { ...todo, editDescription: true };
                            return newTodos;
                          })
                        }}>
                           <IconPen  />

                          </div>
                          {
                            todo.editDescription ? <div className="flex flex-col gap-2 w-full"> <Textarea value={todo.description} onChange={
                              (e) => {
                                setTodos((prev) => {
                                  const newTodos = [...prev];
                                  const index = newTodos.findIndex((t) => t.id === todo.id);
                                  newTodos[index] = { ...todo, description: e.target.value };
                                  return newTodos;
                                })
                              }
                            
                            } />
                            <Button className="bg-primary-1 self-start" onClick={() => {
                              setTodos((prev) => {
                                const newTodos = [...prev];
                                const index = newTodos.findIndex((t) => t.id === todo.id);
                                newTodos[index] = { ...todo, editDescription: false };
                                return newTodos;
                              })
                            }}>
                              Save
                            </Button>
                             </div>: <> 
                            {todo.description ? todo.description : 'No Description'} </>
                          }
                        
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
              
                ))
              : null}
              {
                   
                    isAddingTodo ? <AccordionItem value={'add'}>
                       <AccordionTrigger>
                      <div className="flex items-center gap-2 w-full pr-3">
                        <Checkbox checked={addTodoData.completed} onCheckedChange={(value) => {
                          setAddTodoData((prev) => ({...prev, completed: value}))
                        }} />
                      <Input placeholder="Type Task Title" value={addTodoData.title} onChange={(e) => { setAddTodoData((prev) => ({...prev, title: e.target.value})) }} />
                       
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <IconClock />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={clsx(
                                  "w-[193px] justify-start flex gap-2 text-left font-normal",
                                  !addTodoData.dateDeadline && "text-muted-foreground"
                                )}
                              >
                                {addTodoData.dateDeadline ? (
                                  format(addTodoData.dateDeadline, "PPP")
                                ) : (
                                  <span>Set Date</span>
                                )}
                                <div className="ml-auto">
                                <IconCalendar  />

                                </div>

                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={addTodoData.dateDeadline}
                                onSelect={(value) => {setAddTodoData((prev) => ({...prev, dateDeadline: value}))}}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex items-center gap-5 cursor-pointer" >
                          <div>
                           <IconPen  />

                          </div>
                          <Textarea placeholder="Type Task Description" value={addTodoData.description} onChange={
                              (e) => {
                                setAddTodoData((prev) => ({...prev, description: e.target.value}))
                              }
                            
                            } />
                        
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-primary-1" onClick={() => {
                              setTodos((prev) => [...prev, {...addTodoData, id: Math.random()}])
                              setAddTodoData({
                                title: "",
                                description: "",
                                dateDeadline: null,
                                completed: false,
                              })
                              setIsAddingTodo(false)
                            }}>
                              Save
                            </Button>
                            <Button className="bg-primary-3" onClick={() => {
                              setIsAddingTodo(false)
                              setAddTodoData({
                                title: "",
                                description: "",
                                dateDeadline: null,
                                completed: false,
                              })
                            } }> 
                              Cancel
                            </Button>
                          </div>
                      </div>
                    </AccordionContent>
                       </AccordionItem> : null
                   
              }
          </Accordion>
        </div></>
        }
   
      </DialogContent>
    </Dialog>
  );
}
