import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'k-xhr.js',
  plugins: [
    babel(),
    uglify()
  ]
}
