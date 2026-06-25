import './App.css'
import { SignedIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <h1>Welcome to SLIIT IQ</h1>
      
      <SignOutButton>
        <SignInButton />
      </SignOutButton>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
      
      <UserButton />
    </>
  )
}

export default App
