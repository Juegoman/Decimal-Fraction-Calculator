module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:  {
			options: {
		      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		    },
		    build: {
		      src: 'js/main.js',
		      dest: 'dist/js/main.min.js'
		    }
		},
		cssmin: {
		  target: {
		    files: [{
		      expand: true,
		      cwd: 'dist/css',
		      src: ['*.css', '!*.min.css'],
		      dest: 'dist/css',
		      ext: '.min.css'
		    }]
		  }
		},
		jshint: {
			files: ['Gruntfile.js, js/main.js'],
			options: {
		      // more options here if you want to override JSHint defaults
		    globals: {
		      jQuery: true,
		      console: true,
		      module: true
		    }
		  }
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);
}