(function VideoController($angular) {

    /**
     * @module ngVideo
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngVideo
     * @controller VideoController
     * @param $scope {Object}
     */
    $angular.module(APP_NAME).controller('VideoController',

    function videoController($scope, $timeout, video, ngVideoOptions) {

        /**
         * @property playlistOpen
         * @type {Boolean}
         * @default false
         */
        $scope.playlistOpen = false;

        /**
         * @property videos
         * @type {Object}
         */
        $scope.videos = {
            first: 'http://localhost:8086/video/oceans-clip.webm',
            second: 'http://www.w3schools.com/html/mov_bbb.mp4',
            third: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
        };

        /**
         * @method videoName
         * @param videoModel {Object}
         * @return {String}
         */
        $scope.videoName = function videoName(videoModel) {

            switch (videoModel.src) {
                case ($scope.videos.first): return "oceans";
                case ($scope.videos.second): return "Bunny and Butterfly";
                case ($scope.videos.third): return "Big Buck Bunny";
                default: return "Unknown Video";
            }

        };

        // Add some video sources for the player!
        video.addSource('webm', $scope.videos.first);
        video.addSource('ogg', $scope.videos.second);
        video.addSource('mp4', $scope.videos.third);

    });

})(window.angular);