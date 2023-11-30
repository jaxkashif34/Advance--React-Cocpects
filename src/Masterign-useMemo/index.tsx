// react uses the Reconciliation algorithm to render the component and it's children
import { ComponentProps, memo, useCallback, useMemo, useState } from 'react';
type SwatchProps = { params: { color: string }; onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void };
const Swatch = ({ params, onClick }: SwatchProps) => {
  // changing the props types to the SwatchProps for MemoSwatchWithCB
  //   adding onClick callback so that we can test the useCallback hook
  {
    /* when we don't add memoization app renders as expected when parent renders it's child Swatch also renders and when we add Swatch to memo hook and makes another component then it will not render again after first time or until the props changes  */
  }
  console.log(`Swatch render: ${params.color}`);
  return <div style={{ margin: 2, width: 75, height: 75, backgroundColor: params.color }} onClick={onClick}></div>;
};

const MemoSwatch = memo(Swatch); /* when we add Swatch to memo hook and makes another component then it will not render again after first time or until the props changes  */
/* so actually memoization in react is little different from memoization in simple js 
MEMOIZATION IN REACT is done by using memo hook and how memo hooks works is it compares the old props with the new props and if the props are same then it will not render the component again and display the old component and if the props are different then it will render the component again and display the new component
MEMOIZATION IN VANILLA JS is done by by simply storing the result of a function in a variable properly in object or in array and then when we call the function again with the same arguments then we can simply return the result from the variable instead of calling the function again and again and if the arguments are different then we can call the function again and store the result in the variable
*/

// Quick Tip: if you are having problem with find the type of any argument or something you can just Ctrl + click on the built-in method and it will take you to the definition of that method and there you can find the type of the argument and the return type of the method

const MemoSwatchWithCB = memo(Swatch, (prevProps: ComponentProps<typeof Swatch>, nextProps: ComponentProps<typeof Swatch>) => {
  return prevProps.params.color === nextProps.params.color; // after this it will only render the component when the color changes
});

const MemoSwatchForCallback = memo(Swatch);

/* React.memo only compare the shallow comparison of the props so if we have a complex object as a prop then it will create a new object every time and it will not compare the properties of the object so it will always render the component again and again one way is to do a deep comparison of the object but it is not recommended because it is very expensive and it will slow down the app so the one way is to pass the second argument in the memo high order function and that function will return boolean if it's true don't render component if it's false then render the component and the 2nd way is to use the useCallback hook and memoize the function and pass it as a prop to the component so that it will not create a new function every time and it will not render the component again and again

*/

export function LearnMemo() {
  const [appRenderIndex, setAppRenderIndex] = useState(0);
  const [color, setColor] = useState('red');
  console.log(`App render index: ${appRenderIndex}`);

  /*
    Another way is to use useMemo hook basically it only creates a new object when the dependency changes otherwise it is passing the reference of the same object so it will not create a new object every time and it will not render the component again and again
 */
  const params = useMemo(() => ({ color }), [color]);

  //   good and bad use cases of useMemo

  //   bad use case because we mostly use useMemo for non-primitive values and when we use useMemo for primitive values why would we use useMemo for such a small thing when we can simply create a function and return the result by doing this we are avoiding the useMemo call, dependency array check and the function call
  // const value = useMemo(() => number1 + number2, [number1, number2]);
  //   best way to do this is just simply create a function
  const add = (number1: number, number2: number) => number1 + number2;

  /*   same goes for string
   const value = useMemo(() => `${str1} + ${str2}`, [str1, str2]);

   best way to do this is just simply create a function
  */
  const concat = (str1: string, str2: string) => `${str1} + ${str2}`;

  /*   But here is the good case of useMemo with primitive values (cuz we don't know how big the numbers array will be and by doing this we are avoiding the loop running inside the reduce method) we should mostly use useMemo when returning a object or array
    const value = useMemo(()=> numbers.reduce((acc, curr) => acc + curr, 0), [numbers])
  */

  /*Another good use case 

const person = useMemo(()=>({
    firstName: 'John',
    lastName: 'Doe'
    fullName: `${firstName} ${lastName}`
}), [fist, last])

*/

  const onClickCB = useCallback(() => {}, []);
  return (
    <div className="App">
      <div>
        <button onClick={() => setAppRenderIndex(appRenderIndex + 1)}>Re-Render App</button>
        <button onClick={() => setColor((prev) => (prev === 'red' ? 'blue' : 'red'))}>change color</button>
      </div>
      {/* let's create another button for change the props of MemoSwatch component so that we can see that when props changes then only it can render the Swatch component for that we need a state so when we are change the props it actually re-renders the Swatch component */}
      <div>
        {/* <MemoSwatch color={color} /> throws params Error */}
        {/* the problem with that technique is when we pass an object it will not behave the same way because when we pass an object as a props then it will not behave the same way because it creates the new object every time with the same values and re-render the component because react do a shallow copy of props react don't do a deep copy of props */}
        {/* so to overcome this either we use the second argument in memo way or to use the useMemo hook */}
        {/* React.memo with 2nd callback as an argument*/}
        {/* <MemoSwatchWithCB params={{ color }} /> */}

        {/* using the useMemo hook */}
        {/* <MemoSwatchWithCB params={params} /> */}

        {/* WITHOUT USING THE useCallback */}
        {/* now let's add the onClick callback so that we can test the useCallback hook */}
        {/* so it's broken again because the issue is useMemo works for arrays and objects and useCallback deals with functions and will give exactly the same function instead of creating a new function (which is happening here) */}
        {/* <MemoSwatchForCallback params={params} onClick={() => {}} /> */}

        {/* USING THE useCallback */}
        {/* so now it's working as expected */}
        {/* here we are using the memoization version of both params and onClickCB */}
        <MemoSwatchForCallback params={params} onClick={onClickCB} />
      </div>
    </div>
  );
}
