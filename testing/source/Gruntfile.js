module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sourceRoot: 'assets',
    buildRoot: '../build/<%= sourceRoot %>/',

    jshint: {
      options: {
        force: true
      },
      all: ['<%= sourceRoot %>/js/script.js']
    },

    uglify: {
      dist: {
        files: {
          '<%= buildRoot %>/js/script.min.js': [
            '<%= sourceRoot %>/js/modernizr.min.js',
            '<%= sourceRoot %>/js/picturefill-2.1.0.beta.js',
            '<%= sourceRoot %>/js/jquery-1.11.1.min.js',
            '<%= sourceRoot %>/js/script.js'
          ]
        }
      }
    },

    sass: {
      dist: {
        options: {
          require: ['susy', 'breakpoint'],
          style: 'expanded',
          sourcemap: 'none'
        },
        files: {
          '<%= buildRoot %>/css/style.css' : '<%= sourceRoot %>/sass/style.scss'
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= buildRoot %>/images'
        }]
      },
      svgpng: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/svg/png',
          src: ['**/*.png'],
          dest: '<%= buildRoot %>/svg/png'
        }]
      },
      iconspng: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/icons/png',
          src: ['**/*.png'],
          dest: '<%= buildRoot %>/icons/png'
        }]
      }
    },

    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/svg',
          src: ['**/*.svg'],
          dest: '<%= buildRoot %>/svg',
          ext: '.svg'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/icons',
          src: ['**/*.svg'],
          dest: '<%= buildRoot %>/icons',
          ext: '.svg'
        }]
      }
    },

    svg2png: {
      all: {
        files: [
          {
            src: ['<%= sourceRoot %>/svg/*.svg'],
            dest: '<%= sourceRoot %>/svg/png'
          }
        ]
      }
    },

    grunticon: {
      myIcons: {
        files: [{
          expand: true,
          cwd: '<%= sourceRoot %>/icons',
          src: ['*.svg', '*.png'],
          dest: "<%= sourceRoot %>/icons"
        }],
        options: {
          datasvgcss: "icons.data.svg.scss",
          datapngcss: "icons.data.png.scss",
          urlpngcss: "icons.fallback.scss",
          pngpath: "../icons/png"
        }
      }
    },

    notify: {
      watch: {
        options: {
          title: 'Grunt Watch Complete',  // optional
          message: 'SASS and JS compiled', //required
        }
      }
    },

    watch : {
      livereloadcss: {
        files: ['<%= buildRoot %>/**/*.css'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: ['<%= sourceRoot %>/js/**/*.js'],
        tasks: ['jshint', 'uglify', 'notify:watch'],
        options: {
          livereload: true
        }
      },
      stylesheets: {
        files: ['<%= sourceRoot %>/sass/**/*.scss'],
        tasks: ['sass:', 'notify:watch']
      },
      html: {
        files: ['**/*.{html,php,aspx,aspx.cs}'],
        options: {
          livereload: true
        }
      },
      images: {
        files: ['<%= sourceRoot %>/images/**/*.{png,jpg,gif}'],
        tasks: ['newer:imagemin:dynamic'],
        options: {
          livereload: true
        }
      },
      svgmin: {
        files: ['<%= sourceRoot %>/svg/**/*.svg'],
        tasks: ['newer:svgmin:dist'],
        options: {
          livereload: true
        }
      },
      svg2png: {
        files: ['<%= sourceRoot %>/svg/*.svg'],
        tasks: ['newer:svg2png']

      },
      svgpngmin: {
        files: ['<%= sourceRoot %>/svg/png/**/*.{png,jpg,gif}'],
        tasks: ['newer:imagemin:svgpng']
      },
      grunticon: {
        files: ['<%= sourceRoot %>/icons/**/*.svg'],
        tasks: ['grunticon:myIcons']
      },
      grunticonsvgmin: {
        files: ['<%= sourceRoot %>/icons/**/*.svg'],
        tasks: ['newer:svgmin:icons']
      },
      grunticonpngmin: {
        files: ['<%= sourceRoot %>/icons/png/**/*.{png,jpg,gif}'],
        tasks: ['newer:imagemin:iconspng']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
          '<%= buildRoot %>/css/*.css'
          ]
        },
        options: {
          watchTask: true,
          proxy: "alleycat.local.dev",
          ghostMode: {
            scroll: false
          }
        }
      }
    },

  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-svg2png');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-notify');

  // Default task(s).
  grunt.registerTask('default', ['grunticon', 'sass', 'jshint', 'uglify', 'svgmin', 'svg2png', 'imagemin', 'notify:watch']);

  grunt.registerTask('browser_watch', ['browserSync', 'watch']);

};