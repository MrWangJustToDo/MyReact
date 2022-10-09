// this part of logic implement vue composition api like component
/**
 * usage:
 * const Reactive = createReactive(
 *  () => {
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
 *  }
 * );
 *
 * <Reactive /> only except props just like <Consumer />
 *
 * const App = () => {
 *  return <>
 *    <Consumer>
 *      {(context) => (<Reactive>
 *          // support function
 *          {(data) => <div>{data.fff}</div>}
 *          // support jsx
 *          <p>123</p>
 *        </Reactive>)}
 *    </Consumer>
 *  </>
 * }
 */

export * from "./feature";
export * from "./instance";
