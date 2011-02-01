(ns pulse.term
  (:require [clj-json.core :as json])
  (:require [clj-redis.client :as redis])
  (:require [pulse.config :as config])
  (:require [pulse.util :as util]))

(defn redraw [snap]
  (printf "\u001B[2J\u001B[f")
  (printf "events/sec       %d\n" (get snap "events_per_second" 0))
  (printf "internal/sec     %d\n" (get snap "events_internal_per_second" 0))
  (printf "external/sec     %d\n" (get snap "events_external_per_second" 0))
  (printf "unparsed/sec     %d\n" (get snap "events_unparsed_per_second" 0))
  (printf "nginx req/sec    %d\n" (get snap "nginx_requests_per_second" 0))
  (printf "nginx err/min    %d\n" (get snap "nginx_errors_per_minute" 0))
  (printf "nginx 500/min    %d\n" (get snap "nginx_500_per_minute" 0))
  (printf "nginx 502/min    %d\n" (get snap "nginx_502_per_minute" 0))
  (printf "nginx 503/min    %d\n" (get snap "nginx_503_per_minute" 0))
  (printf "nginx 504/min    %d\n" (get snap "nginx_504_per_minute" 0))
  (printf "varnish req/sec  %d\n" (get snap "varnish_requests_per_second" 0))
  (printf "hermes req/sec   %d\n" (get snap "hermes_requests_per_second" 0))
  (printf "hermes H10/min   %d\n" (get snap "hermes_H10_per_minute" 0))
  (printf "hermes H11/min   %d\n" (get snap "hermes_H11_per_minute" 0))
  (printf "hermes H12/min   %d\n" (get snap "hermes_H12_per_minute" 0))
  (printf "hermes H13/min   %d\n" (get snap "hermes_H13_per_minute" 0))
  (printf "hermes H99/min   %d\n" (get snap "hermes_H99_per_minute" 0))
  (printf "ps converge/sec  %d\n" (get snap "ps_converges_per_second" 0))
  (printf "ps run req/min   %d\n" (get snap "ps_run_requests_per_minute" 0))
  (printf "ps stop req/min  %d\n" (get snap "ps_stop_requests_per_minute" 0))
  (printf "ps kill req/min  %d\n" (get snap "ps_kill_requests_per_minute" 0))
  (printf "ps run/min       %d\n" (get snap "ps_runs_per_minute" 0))
  (printf "ps return/min    %d\n" (get snap "ps_returns_per_minute" 0))
  (printf "ps trap/min      %d\n" (get snap "ps_traps_per_minute" 0))
  (printf "ps lost          %d\n" (get snap "ps_lost" 0))
  (printf "slugc inv/min    %d\n" (get snap "slugc_invokes_per_minute" 0))
  (printf "slugc fail/min   %d\n" (get snap "slugc_fails_per_minute" 0))
  (printf "slugc err/min    %d\n" (get snap "slugc_errors_per_minute" 0))
  (flush))

(def rd
  (redis/init {:url config/redis-url}))

(def snap-a
  (atom {}))

(defn receive [_ stat-json]
  (let [[k v] (json/parse-string stat-json)]
    (swap! snap-a assoc k v)
    (redraw @snap-a)))

(defn -main []
  (redis/subscribe rd ["stats"] receive))