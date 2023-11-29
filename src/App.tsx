import { DecisionMaker } from './Containers'
import { AttributesProvider, OptionsProvider } from './Contexts'


function App() {
  return (
    <AttributesProvider>
      <OptionsProvider>
        <DecisionMaker />
      </OptionsProvider>
    </AttributesProvider>
  )
}


export default App
