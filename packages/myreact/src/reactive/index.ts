// this part of logic implement vue composition api like component
/**
 * usage:
 * const Reactive = createReactive(
 *  () => {
 *    const data = reactive({a: 1});
 *
 *    onBeforeMounted(() => {
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
 *    })
 *
 *    onBeforeUnmount(() => {
 *
 *    })
 *
 *    onUnmounted(() => {
 *
 *    })
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
 *        </Reactive>)}
 *    </Consumer>
 *  </>
 * }
 */
export * from "./hook";
export * from "./feature";
export * from "./instance";
