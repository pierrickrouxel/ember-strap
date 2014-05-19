module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-broccoli')

    grunt.initConfig({
        broccoli: {
            dist: {
                dest: 'dist',
                env: 'production'
            },

            dev: {
                env: 'development'
            }
        }
    });


    grunt.registerTask('default', 'broccoli:dist:build');
    grunt.registerTask('serve', 'broccoli:dev:serve');
}