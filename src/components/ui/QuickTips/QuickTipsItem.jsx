import clsx from "clsx";


export default function QuickTipsItem({ icon, type, onClick }) {
  return (  
    <button onClick={onClick} className={clsx( type === 'group' ? 'w-[68px] h-[68px]' : `w-[60px] h-[60px]`  ,` rounded-full flex items-center justify-center`, type === 'group' && 'bg-primary-1', (type === 'task' || type === 'chat') && 'bg-[#F2F2F2]')}
     >
    <div className="quick-tips-item-icon">
        {icon}
      </div>
     
    </button>
  );
}

