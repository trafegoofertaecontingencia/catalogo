export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-white py-4 mt-10">
      <div className="container mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Marccini. Todos os direitos reservados.
      </div>
    </footer>
  )
}
