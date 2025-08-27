export function Card({ className = '', children }) {
  return <div className={`bg-white rounded-2xl shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>
}

const buttonVariantClasses = {
  primary: 'bg-gray-900 text-white hover:bg-black',
  outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
}

const buttonSizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
}

export function Button({ className = '', variant = 'primary', size = 'md', ...props }) {
  const variantClasses = buttonVariantClasses[variant] || buttonVariantClasses.primary
  const sizeClasses = buttonSizeClasses[size] || buttonSizeClasses.md
  return <button className={`${variantClasses} ${sizeClasses} disabled:opacity-60 disabled:cursor-not-allowed transition ${className}`} {...props} />
}

export function Input({ className = '', ...props }) {
  return <input className={`w-full border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none rounded-lg px-3 py-2 placeholder:text-gray-400 ${className}`} {...props} />
}

export function Select({ className = '', ...props }) {
  return <select className={`w-full border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none rounded-lg px-3 py-2 ${className}`} {...props} />
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-5 py-4 border-b ${className}`}>{children}</div>
}

export function CardBody({ className = '', children }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}


