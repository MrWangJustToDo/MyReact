// this part of logic implement vue composition api like component
/**
 * usage:
 * const Reactive = createReactive({
 *  setUp: (props) => {
 *    const data = reactive({a: 1});
 * 
 *    onBeforeMount(() => {
 * 
 *    })
 * 
 *    onMounted(() => {
 * 
 *    })
 * 
 *    onBeforeUpdate(() => {
 *    
 *    })
 * 
 *    onUpdated(() => {
 * 
 *    });
 * 
 *    return {data};  return a object
 *    return () => <div>{data.a}</div>  return a function
 *  },
 * });
 *
 * const App = () => {
 *  return <>
 *    <Reactive>
 *      // support function
 *      {(data) => <div>{data.fff}</div>}
 *      // support jsx
 *      <p>123</p>
 *    </Reactive>
 *  </>
 * }
 */
