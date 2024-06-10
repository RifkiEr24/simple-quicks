import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { deleteComment, getComment, getPosts, postComment } from "@/services/post/getPost"
import { useEffect, useRef, useState } from "react"
import IconUser from "../icon/IconUser"
import clsx from "clsx"
import IconBack from "../icon/IconBack"
import { Input } from "./input"
import { Button } from "./Button"
import IconMore from "../icon/IconMore"

export default function QuickTask({open, index, onClose, container}) {

  const [posts, setPosts] = useState({
    data: [],
    page: 0,
    total: 0
  })

  const [selectedPost, setSelectedPost] = useState({
    id: "",
    text: "",
    publishDate: "",
    latestComment: null,
    comments: {}
  })

    const [onDetailPost, setOnDetailPost] = useState(false)
  
    const [messageInput, setMessageInput] = useState("")

  const formatDateString = (dateString, mode = 'full') => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (mode === 'dateOnly') return `${day}/${month}/${year}`;
    if (mode === 'timeOnly') return `${hours}:${minutes}`;
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const handleGetPost = async () => {
    try {
      const payload = {
        params: {limit: 6}
      }
      const response = await getPosts(payload)
      
      if (response.status === 200) {
        const postsData = response.data.data.map((item) => ({
          ...item,
          latestComment: null,
          comments: {}
        }))

        for (const post of postsData) {
          const commentResponse = await getComment(post.id, {params: {limit: 1}})
          if (commentResponse.status === 200) {
            const comments = commentResponse.data.data;
            if (comments.length > 0) {
              post.latestComment = comments[0];
              const commentsByDate = {};

              comments.reverse().forEach((comment) => {
                  const publishDate = formatDateString(comment.publishDate, 'dateOnly');
                  if (!commentsByDate[publishDate]) {
                    commentsByDate[publishDate] = [];
                  }
                  commentsByDate[publishDate].push(comment);
                
              });

              post.comments = commentsByDate;
              console.log(post.comments)
            }
          }
        }

        setPosts({
          data: postsData,
          page: response.data.page,
          total: response.data.total
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickPost = (post) => {
    setSelectedPost(post)
    setOnDetailPost(true)
  }



  const handleSendComment = async (message) => {
    try {
      const payload = {
        data: {
          message: messageInput,
          owner: '6666fc43f47c6f581caeb135',
          post: selectedPost.id 
        }
      }
      const response = await postComment(payload)
      if (response.status === 200) {
        if (!selectedPost.comments[formatDateString(response.data.publishDate, ' dateOnly')]) {
          selectedPost.comments[formatDateString(response.data.publishDate, 'dateOnly')] = [];
        }
        selectedPost.comments[formatDateString(response.data.publishDate, 'dateOnly')].push({...response.data}) 

        setPosts({
          ...posts,
          data: posts.data.map((item) => {
            if (item.id === selectedPost.id) {
              return selectedPost
            }
            return item
          })
        })

        setMessageInput("")
      }
    } catch (error) {
      console.log(error)
    }
  
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId)
      if (response.status === 200) {
       setPosts({
        ...posts,
        data: posts.data.map((item) => {
          if (item.id === selectedPost.id) {
            item.comments = Object.keys(item.comments).reduce((acc, date) => {
              acc[date] = item.comments[date].filter((comment) => comment.id !== commentId)
              return acc
            }, {})
            return item
          }
          return item
       })
      })

      setSelectedPost({
        ...selectedPost,
        comments: Object.keys(selectedPost.comments).reduce((acc, date) => {
          acc[date] = selectedPost.comments[date].filter((comment) => comment.id !== commentId)
          return acc
        }, {})
      })
    }
    } catch (error) {
      console.log(error)
    }
  
  }

  useEffect(() => {
    if (open) {
      handleGetPost()
    }
  }, [open])

  return (
    <Dialog open={open} modal={false}>
      <DialogContent index={index} onClose={onClose} container={container}>
        <div className="flex flex-col text-sm font-normal h-full">
          { !onDetailPost ? <div className="py-[22px] px-[32px]">
            {posts.data.map((item) => (
              <div key={item.id} className="flex gap-[17px] py-[22px] border-b border-b-primary-3" onClick={() => handleClickPost(item)}>
                <div className="flex relative justify-center min-w-[54px]">
                  {Object.keys(item.comments).length || item.latestComment ? (
                    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-primary-4 [&_path]:fill-black opacity-45">
                      <IconUser />
                    </div>
                  ) : null}
                  
                  <div className={clsx("w-[34px] h-[34px] rounded-full flex items-center justify-center bg-primary-1", (Object.keys(item.comments).length || item.latestComment) && 'ml-[-14px] z-20')}>
                    <IconUser />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    <span className="text-primary-1 max-w-[415px] font-semibold text-sm">{item.text}</span>
                    <span className="text-xs self-start mt-1 text-nowrap">{formatDateString(item.publishDate)}</span>
                  </div>
                  {item.latestComment && (
                    <div className="flex flex-col text-xs text-primary-2 mb-2">
                      <span className="font-bold">
                        {item.latestComment.owner.firstName} {item.latestComment.owner.lastName}:
                      </span>
                      <span>
                        {item.latestComment.message}
                      </span>
                    </div>
                  )}
                
                </div>
              </div>
            ))}
          </div> : 
          <>
            <div className="flex gap gap-[15px] border-b border-b-[#BDBDBD] py-[19px] px-[25px]">
              <button onClick={() => {setOnDetailPost(false)}}>
                  <IconBack />
              </button>
              <div className="flex flex-col gap-[9px]">
                  <span className="text-primary-1 max-w-[415px] font-semibold text-sm">{selectedPost.text}</span>
                  <span className="text-xs"> 3 Participant</span>
              </div>
          
            </div>
              <div className="overflow-y-scroll flex-grow-[1] py-[22px] px-[32px]">
              {
                Object.keys(selectedPost.comments).map((date) => (
                  <div key={date} className="flex flex-col gap-[9px] py-2">
                    <div className="flex gap-3 items-center">
                      <div className="h-[1px] w-full bg-primary-2"/>
                      <span className="text-xs text-primary-2 font-semibold flex-grow-[1]  text-nowrap">{date}</span>
                      <div className="h-[1px] w-full bg-primary-2" />
                    </div>
                    {selectedPost.comments[date].map((comment, index) => (
                      <div key={comment.id} className={clsx("flex gap-[15px]", comment.owner.id === '6666fc43f47c6f581caeb135' && 'items-end justify-end')}>
                        <div className={clsx("self-start mt-7", comment.owner.id != '6666fc43f47c6f581caeb135' ? 'order-3'  : null)}>
                        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button> <IconMore/> </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">

          <DropdownMenuItem onClick={() => {handleDeleteComment(comment.id)}}>
            
            <span className="text-indicator-3">Delete</span>
          </DropdownMenuItem>
      
      </DropdownMenuContent>
    </DropdownMenu>
                        </div>
                        <div className={clsx("flex flex-col gap-[5px]", comment.owner.id === '6666fc43f47c6f581caeb135' && 'items-end justify-end')}>
                          <span className={clsx("text-xs  font-semibold",  comment.owner.id === '6666fc43f47c6f581caeb135' ? 'text-chats-2-foreground' : 'text-chats-1-foreground')}>{ comment.owner.id === '6666fc43f47c6f581caeb135' ? 'Me' : `${comment.owner.firstName}  ${comment.owner.lastName}`}</span>
                          
                          
                          <div className={clsx(" p-[10px] rounded-[5px] self-start flex flex-col gap-2 text-primary-2", comment.owner.id === '6666fc43f47c6f581caeb135' ? 'bg-chats-2-default' : 'bg-chats-1-default' )}>
                            <span className="text-xs ">{comment.message}</span>
                            <span className="text-xs">{formatDateString(comment.publishDate, 'timeOnly')}</span>
                          </div>
                        </div>
                      </div>
                    ))}


                  </div>
                ))
              }
            
          </div>
          <div className="mt-auto py-[22px] px-[32px] flex gap-3">
                <Input placeholder="Type your message here" value={messageInput} onChange={(event) => {setMessageInput(event.target.value)}} />
                <Button onClick={()=>{handleSendComment()}} disabled={!messageInput} >Send</Button>
              </div>
          </>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}