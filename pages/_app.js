function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
