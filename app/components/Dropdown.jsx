import {React, useState, useRef, forwardRef} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';

function QuestionBar({onDropdownClick, isOpen, question}) {
  return (
    <button
      className="w-full min-h-10 h-auto bg-transparent flex flex-row"
      onClick={() => onDropdownClick()}
    >
      <div className="flex flex-grow h-auto text-black my-auto bg-transparent">
        {question}
      </div>
      <div className="w-auto h-auto bg-inherit my-auto px-3">
        <svg
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="4" width="4" height="16" fill="black" />
          <rect x="4" y="10" width="16" height="4" fill="black" />
        </svg>
      </div>
    </button>
  );
}

const AnswerBar = forwardRef(({children}, ref) => {
  return (
    <div className="h-0 opacity-0 w-full overflow-hidden " ref={ref}>
      <div className="py-2">{children}</div>
    </div>
  );
});

export function Dropdown({title, children}) {
  const [isOpen, setOpen] = useState(false);
  const answerBarRef = useRef();
  const parentRef = useRef();
  const {contextSafe} = useGSAP();
  const onDropdownClick = contextSafe(() => {
    if (isOpen) {
      gsap.to(answerBarRef.current, {
        height: 0,
        opacity: 0,
      });
    } else {
      gsap.to(answerBarRef.current, {
        height: 'auto',
        opacity: 1,
      });
    }
    setOpen(!isOpen);
  });

  return (
    <div className="w-full border-b border-b-white" ref={parentRef}>
      <QuestionBar
        onDropdownClick={onDropdownClick}
        isOpen={isOpen}
        question={title}
      />
      <AnswerBar ref={answerBarRef}> {children} </AnswerBar>
    </div>
  );
}
